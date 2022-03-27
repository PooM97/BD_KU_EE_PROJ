import aiohttp

class DatabaseManager():
    def __init__(self, url) -> None:
        self.url = url

    async def post(self, payload): 
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(f'{self.url}/ts/post', json=payload) as res:
                    print(payload['timestamp'])                    
                    if not res.ok:
                        print(res.status, await res.read())                        
                    return True                          
            except:
                print('Requested error', payload)
                return False   
                