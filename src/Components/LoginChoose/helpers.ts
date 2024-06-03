import data from '../../data.json'

export const shuffle = (array: Array<{ chainId?: string, nodeUrl: string }>) => {
  return array.sort(() => Math.random() - 0.5)
}

export const loginChainsData = shuffle([
  {
    nodeUrl: 'https://wax.greymass.com'
  },
  {
    nodeUrl: 'https://wax.pink.gg'
  },
  {
    nodeUrl: 'https://wax.cryptolions.io'
  },
  {
    nodeUrl: 'https://wax.eu.eosamsterdam.net'
  }
])

export const chainsData = shuffle([
  {
    nodeUrl: data['responseEndpoint-1']
  },
  {
    nodeUrl: data['responseEndpoint-2']
  },
  {
    nodeUrl: data['responseEndpoint-3']
  },
  {
    nodeUrl: data['responseEndpoint-4']
  },
  {
    nodeUrl: data['responseEndpoint-5']
  }
])