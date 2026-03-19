// Progress Storage Module - LocalStorage 进度持久化模块

const STORAGE_KEYS = {
  USER_PROGRESS: "fitpulse_user_progress",
  WORKOUT_HISTORY: "fitpulse_workout_history",
  WEEKLY_ACTIVITY: "fitpulse_weekly_activity",
  USER_PROFILE: "fitpulse_user_profile",
  APP_SETTINGS: "fitpulse_app_settings",
};

/**
 * 获取默认用户进度数据
 */
function getDefaultProgress() {
  return {
    totalCalories: 0,
    totalWorkoutMinutes: 0,
    workoutDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: null,
    totalWorkouts: 0,
  };
}

/**
 * 获取默认设置
 */
function getDefaultSettings() {
  return {
    soundEnabled: true,
    reminderEnabled: false,
    reminderTime: "09:00",
  };
}

/**
 * 从 LocalStorage 读取数据
 * @param {string} key 存储键名
 * @param {*} defaultValue 默认值
 * @returns {*} 解析后的数据
 */
function readFromStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[Storage] Failed to read ${key}:`, error);
    return defaultValue;
  }
}

/**
 * 写入数据到 LocalStorage
 * @param {string} key 存储键名
 * @param {*} value 要存储的数据
 */
function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to write ${key}:`, error);
    return false;
  }
}

// ============ 用户进度 API ============

/**
 * 获取用户进度数据
 */
export function getUserProgress() {
  return readFromStorage(STORAGE_KEYS.USER_PROGRESS, getDefaultProgress());
}

/**
 * 保存用户进度数据
 * @param {Object} progress 进度数据
 */
export function saveUserProgress(progress) {
  return writeToStorage(STORAGE_KEYS.USER_PROGRESS, progress);
}

/**
 * 更新用户进度（增加卡路里和时间）
 * @param {number} calories 燃烧的卡路里
 * @param {number} minutes 锻炼分钟数
 */
export function updateUserProgress(calories, minutes) {
  const current = getUserProgress();
  const today = new Date().toDateString();
  const lastDate = current.lastWorkoutDate ? new Date(current.lastWorkoutDate).toDateString() : null;
  
  // 计算连续锻炼天数
  let newStreak = current.currentStreak;
  if (lastDate) {
    const lastDateObj = new Date(lastDate);
    const todayObj = new Date(today);
    const diffDays = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // 昨天锻炼了，今天继续
      newStreak = current.currentStreak + 1;
    } else if (diffDays > 1) {
      // 中断了
      newStreak = 1;
    }
    // diffDays === 0 表示同一天，不增加streak
  } else {
    // 第一次锻炼
    newStreak = 1;
  }

  const newProgress = {
    totalCalories: current.totalCalories + calories,
    totalWorkoutMinutes: current.totalWorkoutMinutes + minutes,
    workoutDays: current.workoutDays + 1,
    currentStreak: newStreak,
    longestStreak: Math.max(current.longestStreak, newStreak),
    lastWorkoutDate: new Date().toISOString(),
    totalWorkouts: current.totalWorkouts + 1,
  };

  saveUserProgress(newProgress);
  return newProgress;
}

// ============ 锻炼历史 API ============

/**
 * 获取锻炼历史记录
 */
export function getWorkoutHistory() {
  return readFromStorage(STORAGE_KEYS.WORKOUT_HISTORY, []);
}

/**
 * 添加锻炼历史记录
 * @param {Object} entry 锻炼记录 { title, calories, duration, date }
 */
export function addWorkoutHistory(entry) {
  const history = getWorkoutHistory();
  const newEntry = {
    id: Date.now(),
    ...entry,
    date: entry.date || new Date().toISOString(),
  };
  
  // 保留最近30条记录
  history.unshift(newEntry);
  if (history.length > 30) {
    history.pop();
  }
  
  writeToStorage(STORAGE_KEYS.WORKOUT_HISTORY, history);
  return newEntry;
}

// ============ 每周活动 API ============

/**
 * 获取每周活动数据
 */
export function getWeeklyActivity() {
  return readFromStorage(STORAGE_KEYS.WEEKLY_ACTIVITY, [0, 0, 0, 0, 0, 0, 0]);
}

/**
 * 更新每周活动数据
 * @param {number} dayIndex 星期几 (0-6, 0是周一)
 * @param {number} calories 消耗的卡路里
 */
export function updateWeeklyActivity(dayIndex, calories) {
  const activity = getWeeklyActivity();
  activity[dayIndex] = (activity[dayIndex] || 0) + calories;
  writeToStorage(STORAGE_KEYS.WEEKLY_ACTIVITY, activity);
  return activity;
}

/**
 * 重置本周活动数据（每周一重置）
 */
export function resetWeeklyActivityIfNeeded() {
  const lastReset = localStorage.getItem("fitpulse_weekly_reset");
  const now = new Date();
  const monday = getMonday(now);
  
  if (lastReset) {
    const lastResetDate = new Date(lastReset);
    if (lastResetDate < monday) {
      writeToStorage(STORAGE_KEYS.WEEKLY_ACTIVITY, [0, 0, 0, 0, 0, 0, 0]);
      localStorage.setItem("fitpulse_weekly_reset", monday.toISOString());
    }
  } else {
    localStorage.setItem("fitpulse_weekly_reset", monday.toISOString());
  }
}

/**
 * 获取指定日期所在周的周一
 */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// ============ 用户设置 API ============

/**
 * 获取应用设置
 */
export function getAppSettings() {
  return readFromStorage(STORAGE_KEYS.APP_SETTINGS, getDefaultSettings());
}

/**
 * 保存应用设置
 * @param {Object} settings 设置对象
 */
export function saveAppSettings(settings) {
  return writeToStorage(STORAGE_KEYS.APP_SETTINGS, settings);
}

/**
 * 更新单个设置
 * @param {string} key 设置键名
 * @param {*} value 设置值
 */
export function updateSetting(key, value) {
  const settings = getAppSettings();
  settings[key] = value;
  return saveAppSettings(settings);
}

// ============ 用户资料 API ============

/**
 * 获取用户资料
 */
export function getUserProfile() {
  return readFromStorage(STORAGE_KEYS.USER_PROFILE, null);
}

/**
 * 保存用户资料
 * @param {Object} profile 用户资料
 */
export function saveUserProfile(profile) {
  return writeToStorage(STORAGE_KEYS.USER_PROFILE, profile);
}

// ============ 工具函数 ============

/**
 * 获取今日是星期几 (0-6, 0是周一)
 */
export function getDayOfWeek() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // 转换为周一到周日
}

/**
 * 计算BMI
 * @param {number} heightCm 身高(厘米)
 * @param {number} weightKg 体重(公斤)
 * @returns {string} BMI值
 */
export function calculateBMI(heightCm, weightKg) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return bmi.toFixed(1);
}

/**
 * 格式化数字（添加千位分隔符）
 * @param {number} num 数字
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
