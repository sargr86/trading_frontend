export const TEXT_ONLY_PATTERN_WITHOUT_SPECIALS = /^[^`~!@#$%^&*()_+={}\[\]|\\:;“’<,>.?๐฿0-9]*$/;
export const NUMBER_AFTER_TEXT_PATTERN = /^[a-zA-Z ]/;
export const NO_SPACE_PATTERN = /^\S*$/;
export const TEXT_ONLY_WITH_SPECIALS_PATTERN = /^[a-zA-Z -/]*$/;
export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const URL_PATTERN = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
