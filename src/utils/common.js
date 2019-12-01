/**
 * isEmpty [判断一个值是否为空]
 * @author Terrence
 * @param string key [description]
 * @return 是否为空
 */
export function isEmpty(key) {
    const type = typeof key;
    if (type === 'undefined' || type === 'null') return true;
    if (type === 'string') {
        const res = key.replace(/(^\s*)|(\s*$)/g, '');
        if (res === '' || res === null || res === 'null' || res === undefined || res === 'undefined') {
            return true;
        }
        return false;
    }
    if (type === 'object') {
        /** 数组或者对象 */
        if (key === null) return true;
        if (Object.keys(key).length > 0) return false;
        return true;
    }
    if (type === 'boolean') return !key;
    if (type === 'number') return !key;
    return true;
}

/**
 * jsonDecode [解析json]
 * @author Terrence
 * @param string json [要进行解析的json字符串]
 * @param object defaultValue [解析失败时的默认结果]
 * @return 解析值
 */
export function jsonDecode(json = '', defaultValue = []) {
    try {
        return JSON.parse(json);
    } catch (e) {
        return defaultValue;
    }
}

/**
 * emptyOrBlank [进行对象的判空处理，返回一个默认值]
 * @author Terrence
 * @param object object [要进行判空的对象]
 * @param string key [要进行判空的对象的键名]
 * @param any defaultValue [若是为空要进行设置默认值]
 * @param boolean isJson [是不是要进行解json操作]
 * @return 解析值
 */
export function emptyOrBlank(object, key, defaultValue = '', isJson = false) {
    if (Object.prototype.hasOwnProperty.call(object, key) && !isEmpty(object[key])) {
        /** 若是键存在且键值不为空 */
        if (isJson) {
            /** 若是要解json */
            return jsonDecode(object[key], defaultValue);
        } /** 直接读值 */
        return object[key];
    }
    return defaultValue;
}

/**
 * 存储 Session
 */
export function setSession(name, content) {
    if (this.isEmpty(name)) return false;
    if (typeof content !== 'string') {
        return window.sessionStorage.setItem(name, JSON.stringify(content));
    }
    return window.sessionStorage.setItem(name, content);
}
/**
 * 获取 Session
 */
export function getSession(name) {
    if (!name) return '';
    return window.sessionStorage.getItem(name) ? window.sessionStorage.getItem(name) : '';
}
/**
 * 清除 Session
 */
export function clearSession() {
    window.sessionStorage.clear();
}

/**
 * 随机生成颜色
 * @author majing
 * @return 解析值
 */
export function getRandomColor() {
    const c1 = Math.floor(Math.random() * 255);
    const c2 = Math.floor(Math.random() * 255);
    const c3 = Math.floor(Math.random() * 255);
    return `rgb(${c1},${c2},${c3})`;
}

/**
 * 过滤社媒平台名称
 * @author majing
 * @param string platName [社媒平台名称]
 * @return 解析值
 */
export function filterPlatForm(item) {
    const result = {};
    if (typeof item == 'string') {
        result.isMain = true;
        const sign = item.toLowerCase();
        switch (sign) {
        case 'facebook':
        case 'facebookpage':
            result.platForm = 'facebook';
            result.bgColor = '#4167B2';
            result.icon = 'icon-facebook2';
            result.iconUnUse = 'icon-facebook-';
            break;
        case 'linkedin':
        case 'linkedincompany':
            result.platForm = 'linkedin';
            result.bgColor = '#0084B1';
            result.icon = 'icon-linkedin';
            result.iconUnUse = 'icon-linkedin0';
            break;
        case 'twitter':
            result.platForm = 'twitter';
            result.bgColor = '#1DA1F3';
            result.icon = 'icon-twitter';
            result.iconUnUse = 'icon-Twitter-';
            break;
        case 'youtube':
        case 'youtubechannel':
            result.platForm = 'youtube';
            result.bgColor = '#db332e';
            result.icon = 'icon-youtube';
            result.iconUnUse = 'icon-333';
            break;
        case 'pinterest':
            result.platForm = 'pinterest';
            result.bgColor = '#d53031';
            result.icon = 'icon-pinterest';
            result.iconUnUse = 'icon-pinterest2';
            break;
        case 'instagram':
            result.platForm = 'instagram';
            result.bgColor = '#d4237a';
            result.icon = 'icon-instagram';
            result.iconUnUse = 'icon-instagram1';
            break;
        default:
            result.platForm = item;
            result.bgColor = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
                Math.random() * 255,
            )},${Math.floor(Math.random() * 255)})`;
            result.icon = 'icon-companyreg';
            result.iconUnUse = 'icon-companyreg';
            result.isMain = false;
            break;
        }
    }

    return result;
}

/**
 * getRandKey 获取遍历时的随机key
 * @author Terrence
 * @return result
 */
export function getRandKey() {
    return Math.random()
        .toString(36)
        .substr(2);
}

/**
 * observe [数据埋点公共方法]
 * @param string eventId [事件id]
 * @param string projectId [项目id]
 * @author lishen
 */
export function observe(eventId, projectId, source = '') {
    const data = new FormData();
    data.append('projectId', projectId);
    data.append('eventId', eventId);
    data.append('source', source);
    navigator.sendBeacon('/action/backendObserve', data);
}
