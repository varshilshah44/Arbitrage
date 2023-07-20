from colorama import Style, Fore, init
import logging
from os import path
import time
import subprocess
from exchange_config import how_do_you_usually_launch_python, get_time, ctrl_c_handling, ex, get_balance
import sys
sys.stdin.reconfigure(encoding="utf-8")
sys.stdout.reconfigure(encoding="utf-8")


def bot_money(par):
    required_params = ["renew_time", "balance_to_use",
                       "exchange_1", "exchange_2", "exchange_3", "crypto_pair"]
    if not all(param in par for param in required_params):
        return {
            "data": {},
            "status": False,
            "message": "Required parameters missing",
        }, 400
    print(par)
    renew_time = par['renew_time']
    balance_to_use = par['balance_to_use']
    exchange_1 = par['exchange_1']
    exchange_2 = par['exchange_2']
    exchange_3 = par['exchange_3']
    crypto_pair = par['crypto_pair']
    order_id = par['orderId']
    #  input_list = ["fake-money", renew_time, balance_to_use, exchange_1, exchange_2, exchange_3, crypto_pair]
    init()
    try:
        if len(sys.argv) < 2:
            # input_list = ["mode (fake-money, classic, delta-neutral)", "renew time (in minutes)", "balance to use (USDT)", "exchange 1","exchange 2","exchange 3","crypto pair"]
            input_list = ["fake-money", renew_time, balance_to_use,
                          exchange_1, exchange_2, exchange_3, crypto_pair, order_id]
            output = []

            for inputt in input_list:
                output.append(inputt)
            balance = output[2]
            with open(f"start_balance.txt", "w") as f:
                f.write(balance)
                f.close()
            with open(f"balance.txt", "w") as f:
                f.write(balance)
                f.close()

            if output[6] == '':
                subprocess.run([how_do_you_usually_launch_python, f"main.py", output[0],
                               output[1], output[2], output[3], output[4], output[5], output[7]])
                return {
                    "data": "",
                    "status": True,
                    "message": "Success",
                }, 200

            else:
                subprocess.run([how_do_you_usually_launch_python, f"main.py", output[0],
                               output[1], output[2], output[3], output[4], output[5], output[7], output[6]])
                return {
                    "data": "",
                    "status": True,
                    "message": "Success",
                }, 200

        else:
            print(f"Mode input is incorrect.")
            sys.exit(1)

    except KeyboardInterrupt as e:
        return {
            "data": str(e),
            "status": False,
            "message": "An error occurred",
        }, 500
