/**
 * Author: NERO
 * Date: 2019/3/24 0024
 * Time: 18:16
 *
 */
class BaseModel {
  constructor(data, message) {
    if (typeof data === 'string') {
      this.message = data
      data = null
      message = null
    }
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message)
    this.errno = 0
  }
}
class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message)
    this.errno = -1
  }
}

export default {
  SuccessModel,
  ErrorModel,
}