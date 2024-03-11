import http from 'k6/http'
import { sleep, check } from 'k6'
import uuid from './libs/uuid.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }

//thresholds e métricas
export const options = {
    vus: 10,
    duration: '15s',
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
        'Content-Type': 'application/json',
        'monitor': 'false'
    }
  }

  const res = http.get(url, headers)
  

  check(res, {
    'status should be 200': (r) => r.status === 200
  })
  sleep(1)
}
