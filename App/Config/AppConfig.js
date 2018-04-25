import '../I18n/I18n'

export default {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  bucket: __DEV__ ? 'http://192.168.0.13:8000/' : 'https://420withme.com/',
  domain: __DEV__ ? 'http://192.168.0.13:8000/' : 'https://420withme.com/',
  STATIC: __DEV__ ? 'static/' : '',
  MEDIA: 'media/',
  USER_STORE: '@USER_STORE'
}
