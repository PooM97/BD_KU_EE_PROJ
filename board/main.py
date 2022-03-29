import asyncio, yaml, aiohttp
from time import time, sleep
from indicator import IndicatorManager
from database import DatabaseManager
from datetime import datetime

class DataManager():
    def __init__(self, db_config, di_config) -> None:
        self.db_config = db_config
        self.di_config = di_config
        self.indi = IndicatorManager(self.di_config)
        self.db = DatabaseManager(self.db_config['url'])
        self.time_interval = self.db_config['timeInterval']
        self.payload_list = []
        asyncio.run(self.pull_data())

    async def pull_data(self):
        task = asyncio.create_task(self.post_data())
        boxes = db_config['boxes']
        while True:
            start = time()
            payload = {'data': {}}
            for box in boxes:
                for channel in boxes[box]:
                    no_ch = int(channel[-1]) # ch1 -> 1
                    try:
                        payload['data'][boxes[box][channel]] = self.indi.read_pv(box, no_ch)
                    except:
                        print(f'failed to read channel {no_ch}')
                    sleep(0.005)
            payload['timestamp'] = str(datetime.now().replace(microsecond=0))
            self.payload_list.append(payload)       
            end = time()
            await asyncio.sleep(self.time_interval-(end-start))

    async def post_data(self):
        while True:
            if len(self.payload_list) > 0:
                payload = self.payload_list[0]
                res_ok = await self.db.post(payload)
                if res_ok:
                    self.payload_list.pop(0)
            await asyncio.sleep(0.01)

if __name__ == '__main__':   
    dm = DataManager()