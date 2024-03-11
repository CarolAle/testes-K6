import http from 'k6/http'
import { sleep, check } from 'k6'
import uuid from './libs/uuid.js'

//Teste de Carga
//teste não funcional para até 100 usuários simultânios

//thresholds e métricas
//Carga variável
export const options = {
    stages: [
      { duration: '5m', target: 100 },
      { duration: '1m', target: 100 },
      { duration: '5m', target: 0 }
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
        "monitor": "false",
        'Content-Type': 'application/json'
    }
  }

  const res = http.post(url, payload, headers)
  console.log(res.body)
  console.log(res.request)

  check(res, {
    'status should be 201': (r) => r.status === 201
  })
  sleep(1)
}
