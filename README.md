# efShopFloorIntelligence
eFactory Review Application

```
Data is available with machine1 and machine 2

https://efpf.caixamagica.pt/efshopfloorintelligence/api/getHistoricalEvents
https://efpf.caixamagica.pt/efshopfloorintelligence/api/getHistoricalEvents?machineId=machine2

GET

{
  "list_of_rows": [
    {
      "id": "1226",
      "machineid": "machine1",
      "start": "2020-08-13 13:39:31",
      "stop": null,
      "changeover": null,
      "previous": "C",
      "next": null,
      "productid": "abcd123"
    },
    {
      "id": "1225",
      "machineid": "machine1",
      "start": "2020-08-13 13:37:48",
      "stop": "2020-08-13 13:38:24",
      "changeover": "00:00:36",
      "previous": "A",
      "next": "C",
      "productid": "abcd123"
    },
    {
      "id": "1224",
      "machineid": "machine1",
      "start": "2020-08-13 13:35:59",
      "stop": "2020-08-13 13:36:49",
      "changeover": "00:00:50",
      "previous": "E",
      "next": "A",
      "productid": "abcd123"
    },
    {
      "id": "1223",
      "machineid": "machine1",
      "start": "2020-08-13 13:34:42",
      "stop": "2020-08-13 13:35:32",
      "changeover": "00:00:50",
      "previous": "D",
      "next": "E",
      "productid": "abcd123"
    },
    {
      "id": "1222",
      "machineid": "machine1",
      "start": "2020-08-13 13:33:39",
      "stop": "2020-08-13 13:34:16",
      "changeover": "00:00:37",
      "previous": "E",
      "next": "D",
      "productid": "abcd123"
    },
    {
      "id": "1221",
      "machineid": "machine1",
      "start": "2020-08-13 13:31:46",
      "stop": "2020-08-13 13:32:40",
      "changeover": "00:00:54",
      "previous": "A",
      "next": "E",
      "productid": "abcd123"
    }
  ]
}

https://efpf.caixamagica.pt/efshopfloorintelligence/api/getHistoricalStatistics
https://efpf.caixamagica.pt/efshopfloorintelligence/api/getHistoricalStatistics?machineId=machine1

GET

[
  {
    "machineid": "machine1",
    "previous": "D",
    "next": "D",
    "max": "00:00:29",
    "min": "00:00:29",
    "avg": "00:00:29"
  },
  {
    "machineid": "machine1",
    "previous": "A",
    "next": "B",
    "max": "00:00:47",
    "min": "00:00:47",
    "avg": "00:00:47"
  },
  {
    "machineid": "machine2",
    "previous": "D",
    "next": "E",
    "max": "00:00:55",
    "min": "00:00:20",
    "avg": "00:00:34.952381"
  },
  {
    "machineid": "machine2",
    "previous": "A",
    "next": "D",
    "max": "00:00:59",
    "min": "00:00:21",
    "avg": "00:00:40.022727"
  }
]

https://efpf.caixamagica.pt/efshopfloorintelligence/api/getProductionEvents
https://efpf.caixamagica.pt/efshopfloorintelligence/api/getProductionEvents?machineId=machine1

GET

{
  "productionEvents": [
    {
      "timestamp": "2020-08-04 00:44:14",
      "event": "start",
      "batch": "1245",
      "productId": "abcd123",
      "productTypeCode": "D"
    },
    {
      "timestamp": "2020-08-04 00:44:35",
      "event": "stop",
      "batch": "1245",
      "productId": "abcd123",
      "productTypeCode": "D"
    },
    {
      "timestamp": "2020-08-04 00:45:17",
      "event": "start",
      "batch": "1245",
      "productId": "abcd123",
      "productTypeCode": "C"
    },
    {
      "timestamp": "2020-08-04 00:45:58",
      "event": "stop",
      "batch": "1245",
      "productId": "abcd123",
      "productTypeCode": "C"
    },
    {
      "timestamp": "2020-08-04 00:46:20",
      "event": "start",
      "batch": "1245",
      "productId": "abcd123",
      "productTypeCode": "D"
    },
    {
      "timestamp": "2020-08-04 00:47:10",
      "event": "stop",
      "batch": "1245",
      "productId": "abcd123",
      "productTypeCode": "D"
    },
    {
      "timestamp": "2020-08-04 00:48:05",
      "event": "start",
      "batch": "1245",
      "productId": "abcd123",
      "productTypeCode": "B"
    }
  ]
}

https://efpf.caixamagica.pt/efshopfloorintelligence/api/getTopFastest
https://efpf.caixamagica.pt/efshopfloorintelligence/api/getTopFastest?machineId=machine2

GET

[
  {
    "machineid": "machine2",
    "previous": "D",
    "next": "E",
    "min": "00:00:20"
  },
  {
    "machineid": "machine2",
    "previous": "B",
    "next": "A",
    "min": "00:00:20"
  },
  {
    "machineid": "machine2",
    "previous": "B",
    "next": "B",
    "min": "00:00:20"
  }
]

https://efpf.caixamagica.pt/efshopfloorintelligence/api/getTopSlowest
https://efpf.caixamagica.pt/efshopfloorintelligence/api/getTopSlowest?machineId=machine2

GET

[
  {
    "machineid": "machine1",
    "previous": "C",
    "next": "C",
    "max": "00:00:59"
  },
  {
    "machineid": "machine1",
    "previous": "C",
    "next": "B",
    "max": "00:00:59"
  },
  {
    "machineid": "machine1",
    "previous": "A",
    "next": "A",
    "max": "00:00:58"
  }
]
```


