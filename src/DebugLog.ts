
const TRANSACTIONAL_CONSOLE_DEBUG = process.env.TRANSACTIONAL_CONSOLE_DEBUG

export const debugLog = (message?: any, ...optionalParams: any[]): void => {
  if(TRANSACTIONAL_CONSOLE_DEBUG){
    // tslint:disable-next-line: no-console
    console.log(message, ...optionalParams)
  }
}
