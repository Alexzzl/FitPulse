const HOME_SET = {
  brand: "./assets/CodeBuddyAssets/41_1515/22.svg",
  items: {
    home: "./assets/CodeBuddyAssets/41_1515/23.svg",
    library: "./assets/CodeBuddyAssets/41_1515/24.svg",
    classic: "./assets/CodeBuddyAssets/41_1515/25.svg",
    me: "./assets/CodeBuddyAssets/41_1515/26.svg",
  },
};

const LIBRARY_SET = {
  brand: "./assets/CodeBuddyAssets/41_1708/1.svg",
  items: {
    home: "./assets/CodeBuddyAssets/41_1708/2.svg",
    library: "./assets/CodeBuddyAssets/41_1708/3.svg",
    classic: "./assets/CodeBuddyAssets/41_1708/4.svg",
    me: "./assets/CodeBuddyAssets/41_1708/5.svg",
  },
};

const CLASSIC_SET = {
  brand: "./assets/CodeBuddyAssets/41_1855/1.svg",
  items: {
    home: "./assets/CodeBuddyAssets/41_1855/2.svg",
    library: "./assets/CodeBuddyAssets/41_1855/3.svg",
    classic: "./assets/CodeBuddyAssets/41_1855/4.svg",
    me: "./assets/CodeBuddyAssets/41_1855/5.svg",
  },
};

const PROFILE_SET = {
  brand: "./assets/CodeBuddyAssets/41_1977/1.svg",
  items: {
    home: "./assets/CodeBuddyAssets/41_1977/2.svg",
    library: "./assets/CodeBuddyAssets/41_1977/3.svg",
    classic: "./assets/CodeBuddyAssets/41_1977/4.svg",
    me: "./assets/CodeBuddyAssets/41_1977/5.svg",
  },
};

export function getSidebarIconSet(activeRoute) {
  switch (activeRoute) {
    case "/home":
      return HOME_SET;
    case "/library":
      return LIBRARY_SET;
    case "/classic":
      return CLASSIC_SET;
    case "/me":
      return PROFILE_SET;
    default:
      return HOME_SET;
  }
}
