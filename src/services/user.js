import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(params) {
  return request('/oauth/token',{
    method: 'POST',
    body: params,
  });
}
