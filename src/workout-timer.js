// Workout Timer Module - 计时器核心模块

/**
 * 创建计时器实例
 * @param {Object} config 配置项
 * @param {number} config.initialSeconds 初始秒数
 * @param {boolean} config.autoStart 是否自动开始
 * @param {Function} config.onTick 每秒回调
 * @param {Function} config.onComplete 完成回调
 * @returns {Object} 计时器控制对象
 */
export function createWorkoutTimer(config = {}) {
  const {
    initialSeconds = 0,
    autoStart = false,
    onTick = () => {},
    onComplete = () => {},
  } = config;

  let remainingSeconds = initialSeconds;
  let intervalId = null;
  let isPaused = true;
  let startTime = null;
  let pausedTime = 0;

  function tick() {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      onTick(formatTime(remainingSeconds), remainingSeconds);
    } else {
      stop();
      onComplete();
    }
  }

  function start() {
    if (!isPaused && intervalId) return;
    
    isPaused = false;
    if (startTime === null) {
      startTime = Date.now();
    }
    
    intervalId = setInterval(tick, 1000);
  }

  function pause() {
    if (isPaused) return;
    
    isPaused = true;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    pausedTime = Date.now();
  }

  function stop() {
    isPaused = true;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset(newSeconds = initialSeconds) {
    stop();
    remainingSeconds = newSeconds;
    startTime = null;
    pausedTime = 0;
    onTick(formatTime(remainingSeconds), remainingSeconds);
  }

  function addTime(seconds) {
    remainingSeconds += seconds;
    onTick(formatTime(remainingSeconds), remainingSeconds);
  }

  function getState() {
    return {
      remainingSeconds,
      isPaused,
      isRunning: !isPaused && remainingSeconds > 0,
      elapsed: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
    };
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // 初始化时显示时间
  onTick(formatTime(remainingSeconds), remainingSeconds);

  if (autoStart) {
    start();
  }

  return {
    start,
    pause,
    stop,
    reset,
    addTime,
    getState,
    getFormattedTime: () => formatTime(remainingSeconds),
    getRemainingSeconds: () => remainingSeconds,
    isPaused: () => isPaused,
  };
}

/**
 * 创建倒计时模块 (用于休息页面)
 * @param {number} seconds 倒计时秒数
 * @param {Function} onTick 每次 tick 回调
 * @param {Function} onComplete 完成回调
 */
export function createCountdownTimer(seconds, onTick, onComplete) {
  return createWorkoutTimer({
    initialSeconds: seconds,
    autoStart: true,
    onTick,
    onComplete,
  });
}

/**
 * 格式化秒数为 MM:SS 格式
 * @param {number} totalSeconds 总秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * 解析时间字符串为秒数
 * @param {string} timeString 时间字符串 (MM:SS)
 * @returns {number} 秒数
 */
export function parseTimeToSeconds(timeString) {
  const parts = timeString.split(":");
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  return minutes * 60 + seconds;
}
