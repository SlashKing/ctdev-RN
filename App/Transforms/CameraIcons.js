whiteBalance = (name: string) => {
  switch(name){
    case "auto":
      return "white-balance-auto";
    case "incandescent":
      return "white-balance-incandescent";
    case "sunny":
      return "white-balance-sunny"
    case "cloudy":
      return "weather-cloudy"
    case "fluorescent":
      return "white-balance-iridescent"
    default:
      return "weather-night"
  }

}
flash = (name: string) => {
  switch(name){
    case "on":
      return "flash-outline";
    case "off":
      return "flash-off";
    case "auto":
      return "flash-auto"
    default:
      return "flashlight"
  }
}
export {flash, whiteBalance}
