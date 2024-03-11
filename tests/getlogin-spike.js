import http from 'k6/http'
import { sleep, check } from 'k6'
import uuid from './libs/uuid.js'

//Teste de pico
//thresholds e métricas
export const options = {
  stages: [
    { duration: '2m', target: 2000 },     //aumento rápido de usuários
    { duration: '1m', target: 0 }         //redução rápida para 0 usuários
  ],
  thresholds: {
    http_req_duration: ['p(95) < 250'],
    http_req_failed: ['rate < 0.01']  //1% das requisições podem ocorrer erro
  }
}
const url = 'https://test-api.k6.io'


export function setup() {
  const loginRes = http.post(`${url}/auth/token/login/`, {
    username: 'User123456',
    password: 'teste'
  });
  const token = loginRes.json('access')
  return token
}

export default function (token) {
  const params = {
    'headers': {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }
  const res = http.get(`${url}/my/crocodiles/`, params)
  //console.log(res.body)

  const checkOutput =
    check(res, {
      'status should be 200': (r) => r.status === 200
    })

  if (!checkOutput) {
    console.log(res.status)
  }
}
