class responseWrapper {
  responseSucces(data) {
    return {
      response: 'ok',
      data: data,
    };
  }

  responseError(message) {
    return {
      response: 'error',
      message,
    };
  }
}

export default new responseWrapper