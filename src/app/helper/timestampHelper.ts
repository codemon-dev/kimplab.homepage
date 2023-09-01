export const getCountdown = (timestamp: number, includeDate: boolean = false) => {
    // 입력된 타임스탬프를 밀리초로 변환합니다.
  const targetTime = new Date(timestamp * 1000).getTime(); // Convert to milliseconds

  // 현재 시간을 가져옵니다.
  const currentTime = new Date().getTime(); // Convert to milliseconds

  // 남은 시간을 계산합니다.
  const timeDifference = targetTime - currentTime;

  if (timeDifference <= 0) {
    // 이미 지난 시간이라면 빈 문자열을 반환합니다.
    return 'Countdown expired';
  }

  // 남은 일, 시간, 분 및 초를 계산합니다.
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  const formattedDays = formatTwoDigits(days);
  const formattedHours = formatTwoDigits(hours);
  const formattedMinutes = formatTwoDigits(minutes);
  const formattedSeconds = formatTwoDigits(seconds);
  
    // 카운트다운 문자열을 생성합니다.
    if (days) return `${formattedDays}일 ${formattedHours}시간 ${formattedMinutes}분 ${formattedSeconds}초`;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const formatTwoDigits = (number: number) => {
    // 숫자를 문자열로 변환하고, 만약 숫자가 한 자릿수면 앞에 0을 추가합니다.
    return number.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
}   
  