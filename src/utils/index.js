/**
 * Author: NERO
 * Date: 2019/5/29 0029
 * Time: 23:26
 *
 */
export const multiLoadData = store => (...components) => {
  const loadDataArr = [...components].map(component => component.loadData(store))
  return new Promise(resolve => Promise.all(loadDataArr).then(() => resolve()).catch(() => resolve()))
}
