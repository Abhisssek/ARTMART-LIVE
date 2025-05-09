// Calculate remaining time based on auction start and end time
export const getTimeRemaining = (startTime, endTime) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
  
    if (now < start) return start - now; // Countdown to start
    if (now >= start && now <= end) return end - now; // Countdown to end
    return 0;
  };
  
  // Determine auction status
  export const getAuctionStatus = (startTime, endTime) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
  
    if (now < start) return { text: "Auction Not Started", color: "yellow" };
    if (now >= start && now <= end) return { text: "Auction Active", color: "green" };
    return { text: "Auction Ended", color: "red" };
  };
  
  // Format milliseconds to HH:MM:SS
  export const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };