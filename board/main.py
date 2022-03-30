import asyncio, yaml, aiohttp
from time import time, sleep
from indicator import DGIndicator
from datetime import datetime

class DataManager():
    def __init__(self, config) -> None:
        self.dgi = DGIndicator(config)
        self.payload_list = []
        # database
        db_config = config['database']
        self.url = db_config['url']
        self.time_interval = db_config['timeInterval']
        asyncio.run(self.pull_data())

    async def pull_data(self):
        print('Begin sending data...')
        task = asyncio.create_task(self.requests())
        while True:
            start = time()
            payload = {'data': {}}
            for box in self.dgi.sensorID:
                for channel in self.dgi.sensorID[box]:
                    try:
                        sensorID = self.dgi.sensorID[box][channel]
                        payload['data'][sensorID] = self.dgi.read_pv(box, channel)
                    except:                        
                        payload['data'][sensorID] = 0 # Error -> sending zero
                        print(f"Failed to read {box} channel: {channel}.")
                payload['timestamp'] = str(datetime.now().replace(microsecond=0))                
                sleep(0.01) # Delay before changing box.
            end = time()
            self.payload_list.append(payload)
            await asyncio.sleep(self.time_interval-(end-start))

    async def requests(self):
        while True:
            if len(self.payload_list) > 0:
                payload = self.payload_list[0]
                async with aiohttp.ClientSession() as session:
                    try:
                        async with session.post(f'{self.url}/ts/post', json=payload) as res:                                              
                            if not res.ok:                                
                                print(res.status, await res.read())                            
                            self.payload_list.pop(0)
                    except:
                        print('Requested error', payload)
            await asyncio.sleep(0.01)

if __name__ == '__main__':
    with open('config.yml', 'r') as f:
        config = yaml.load(f, Loader=yaml.FullLoader)
    dm = DataManager(config)