import minimalmodbus
import serial
from time import sleep

""" Config Setting Information
If you don't want to set some settings, use None or remove them from the config file.
More Information: https://www.primusthai.com/uploads/files_th/UM-TIM-94N-4-6CH-F63-02.pdf    
=============== =============================== =====================================
Setting         Range                           Detail
=============== =============================== =====================================    
loc             0-3                             lock (None, all, menu 1, menu 2-7)
display         0-1                             off on
scan            0-30                            Scan display range 1-30 Second. 0 is off.
baudrate        0-6                             1200, 2400, 4800, 9600, 19200, 38400, 57600 bps
address         1-255                           Inducator address. Only used for communication. (not setting)
typecom         0-5                             Data length 8 No parity stop bit 1
-                                               Data length 8 No parity stop bit 2
-                                               Data length 8 Odd parity stop bit 1
-                                               Data length 8 Odd parity stop bit 2
-                                               Data length 8 Even parity stop bit 1
-                                               Data length 8 Even parity stop bit 2
input           0-7 10,11 20-29                 Select input type refer to table 1. (More Information)
pvs             0-9999                          When measurement value error. Set the correction value (-1999 - 9999)
-               65535-63537 for -1to-1999   
pvg             80-120                          When measurement value error. Set the correction value (80 - 120)
pvf             0-15                            Filter effects operation on software to process value (0 - 15)
db              0-3                             decimal point (digit)
c/f             0-1                             Select temperature ํC or ํF
abs             0-1                             Set 1 for display absolute value (When Wrong Wiring)
inv             0-1                             Set 1 for inverse display (Analog input only)
inh             Same as pvs                     Sets scalling high limit value refer to table 2. (More Information)
inl             Same as pvs                     Sets scalling low limit value refer to table 2. (More Information)
slh             Same as pvs                     Sets scalling high limit value for display refer to table 1. (More Information)
Sll             Same as pvs                     Sets scalling low limit value for display refer to table 1. (More Information)
alf             (00) msb 0-5 lsb 0-3            Select functions (More Information)
alh             Same as pvs                     Set high limit value for alarm 1.
all             Same as pvs                     Set low limit value for alarm 1.
hys             0-9999                          Set hysteresis when required.
ton             0-60                            Set delay time (Alarm off) when required. (0 - 60s)
toff            0-60                            Set delay time (Alarm on) when required. (0 - 60s)
opr             0-3                             Set display operator when required. (none, sum, diff, avg)
"""
class DGIndicator():
    def __init__(self, config) -> None:
        self.config = config    
        self.general_register = {            
            'loc': 6,
            'scan':13,
            'baudrate':14,
            'address':15,
            'typecom':16,
        }
        self.channel_register = {
            'display': 7,            
            'input':17,
            'pvs': 18,
            'pvg':19,
            'pvf':20,
            'dp':21,
            'c/f':22,
            'abs':23,
            'inv':24,
            'inh':25,
            'inl':26,
            'slh':27,
            'sll':28,
            'alf':29,
            'alh':30,
            'all':31,
            'hys':32,
            'ton':33,
            'toff':34,
            'opr':35
        }
        baudrate_list = [1200, 2400, 4800, 9600, 19200, 38400, 57600]
        typecom_list =  [
            [serial.PARITY_NONE, serial.STOPBITS_ONE],
            [serial.PARITY_NONE, serial.STOPBITS_TWO],
            [serial.PARITY_ODD, serial.STOPBITS_ONE],
            [serial.PARITY_ODD, serial.STOPBITS_TWO],
            [serial.PARITY_EVEN, serial.STOPBITS_ONE],
            [serial.PARITY_EVEN, serial.STOPBITS_TWO]
        ]
        commu = self.config['communication']
        self.port = commu['port']
        self.baudrate = baudrate_list[commu['baudrate']]
        self.typecom = typecom_list[commu['typecom']]        
        self.__create_boxes()
        self.__general_setting()
        self.__channel_setting()

    def __create_boxes(self):
        print('create virtual boxes...')
        self.boxes = {}
        for box in self.config['boxes']:            
            self.boxes[box['name']] = minimalmodbus.Instrument(self.port, box['address']) # port name, slave address (in decimal)
            box: minimalmodbus.Instrument = self.boxes[box['name']]
            box.serial.baudrate = self.baudrate
            box.serial.bytesize = 8
            box.serial.parity   = self.typecom[0]
            box.serial.stopbits = self.typecom[1]
            box.serial.timeout  = 0.1 # Read timeout value in seconds.
            box.close_port_after_each_call = True      
    
    def __general_setting(self):
        print('general settings...')
        for setting in self.config['general']:            
            value = self.config['general'][setting]           
            if value == None:
                continue  
            register = self.general_register[setting]                    
            for box in self.boxes:
                self.writeIndicator(box, register, value)            
    
    def __channel_setting(self):
        print('channel settings...')
        self.sensorID = {} # {boxname: {channel: sensorID},}
        for box in self.config['boxes']:
            box_name = box['name']
            self.sensorID[box_name] = {}
            for channel in box['channel']:
                for setting in channel:
                    if setting == 'ch':
                        no_channel = channel[setting] - 1 # minus 1 because channel_register is already point to channel 1.
                        continue
                    elif setting == 'sensorID':
                        self.sensorID[box_name][no_channel + 1] = channel[setting] # channel: sensorID
                        continue
                    elif setting == 'display':
                        register = self.channel_register[setting] + no_channel
                    else:
                        register = self.channel_register[setting] + no_channel * 19
                    value = channel[setting]
                    if value == None:
                        continue
                    self.writeIndicator(box_name, register, value)
            sleep(0.01) # Delay before changing box.

    def writeIndicator(self, box_name, register, value, decimal=0, functioncode=6):
        try:      
            box: minimalmodbus.Instrument = self.boxes[box_name]
            box.write_register(register, value, decimal, functioncode)
        except IOError: # communication errors
            ''' communication errors
            communication problems etc the exceptions raised are ModbusException (with subclasses) 
            and serial.serialutil.SerialException, which both
            oare inheriting from IOError (an alias for OSErrr).
            '''
            print(f'Failed to write {box_name} register {register}.')
    
    def readIndicator(self, box_name, register, decimal=0):       
        box: minimalmodbus.Instrument = self.boxes[box_name] 
        return box.read_register(register, decimal) # Registernumber, number of decimals    

    def my_boxes(self):
        """return list of box"""
        return list(self.boxes.keys())

    def read_pv(self, box_name:str, channel:int):
        """return process value"""
        ch = channel-1
        dp_register = 21 + 19*(ch)
        dp = self.readIndicator(box_name, dp_register) # get decimal point
        return self.readIndicator(box_name, ch, dp)

    def read_all_pv(self, box_name):
        """return all process value of box"""
        value = {}
        for channel in range(6): # read channel 1-6
            value[f'pv{channel+1}'] = self.read_pv(box_name, channel + 1)  
        return value

    def read_all_setting(self, box_name):
        """print all setting of box"""
        for i in range(131):
            print(f'register {i}:', self.readIndicator(box_name, i))
        