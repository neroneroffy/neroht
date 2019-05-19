/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:59
 *
 */

const env = process.env.NODE_ENV

export const SPECIAL_CHARACTER_REG = /[~!@#$%^&*()/\|<>;_+-=\[\]{}]/g;
export const PAGE = 0;
export const SIZE = 10;
export const API_PREFIX = '/api/nht'
export const API_HOST = 'http://localhost:8081'
export const API_SERVER = API_HOST + API_PREFIX
// export const API_SERVER = API_PREFIX

