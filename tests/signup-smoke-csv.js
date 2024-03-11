import http from 'k6/http'
import { sleep, check } from 'k6'
import uuid from './libs/uuid.js'
import { SharedArray } from 'k6/data'
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js'

//Critérios:
//Smoke test
// 1 usuário por 1 minuto
//Limites: Requisição com sucesso > 99%

//thresholds e métricas
export const options = {
    vus: 1,
    duration: '5s',
    thresholds: {
        checks: ['rate > 0.99'],
        http_req_duration: ['p(95)<2000'],   // 95% das requisições devem responder em até 2s
        http_req_failed: ['rate<0.01']  //1% das requisições podem ocorrer erro
    }
}

const csvData = new SharedArray('Ler dados', function(){
  return papaparse.parse(open('./usuario.csv'), {header: true}).data
})

export default function () {
  const url = 'http://localhost:3000/login'

  const USER = csvData[Math.floor(Math.random() * csvData.length)].email;
  const PASS = csvData[Math.floor(Math.random() * csvData.length)].password;

  console.log(USER + PASS)
  const payload = JSON.stringify(
    { email: USER, password: PASS }
  )

  const headers = {
    'headers': {
        'Content-Type': 'application/json'
    }
  }

  const res = http.post(url, payload, headers)
  console.log(res.body)

  check(res, {
    'status should be 200': (r) => r.status === 200
  })
  sleep(1)
}
