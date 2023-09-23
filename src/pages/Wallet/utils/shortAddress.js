
export function trimAddress(address) {
    if (address.length < 8) {
      return address; // 주소 길이가 8자 미만이면 그대로 반환
    }
  
    const prefix = address.substring(0, 4); // 앞의 4자리
    const suffix = address.substring(address.length - 4); // 뒤의 4자리
  
    return `${prefix}...${suffix}`;
  }
  