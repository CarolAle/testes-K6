import http from 'k6/http'
import { sleep, check } from 'k6'
import uuid from './libs/uuid.js'

//Teste de Stress

//thresholds e métricas
export const options = {
  stages: [
    { duration: '10m', target: 200 }, 
    { duration: '30m', target: 200 }, 
    { duration: '5m', target: 0 }, 
  ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],   // 95% das requisições devem responder em até 2s
        http_req_failed: ['rate<0.01']  //1% das requisições podem ocorrer erro
    }
}

export default function () {
  const url = 'http://localhost:3000/usuarios'

  const payload = JSON.stringify(
    { nome: 'Fulano da Silva', email: `${uuid.v4().substring(24)}@qa.com.br`, password: 'teste', administrador: 'true'}
  )

  const headers = {
    'headers': {
        monitor: false,
        'Content-Type': 'application/json'
    }
  }

  const res = http.post(url, payload, headers)

  check(res, {
    'status should be 201': (r) => r.status === 201
  })
  sleep(1)
}
