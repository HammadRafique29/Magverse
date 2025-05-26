import os
import platform
import subprocess
import sys
import shutil
import signal


intro = """

$$\      $$\                                                                       
$$$\    $$$ |                                                                      
$$$$\  $$$$ | $$$$$$\   $$$$$$\ $$\    $$\  $$$$$$\   $$$$$$\   $$$$$$$\  $$$$$$\  
$$\$$\$$ $$ | \____$$\ $$  __$$\\$$\  $$  |$$  __$$\ $$  __$$\ $$  _____|$$  __$$\ 
$$ \$$$  $$ | $$$$$$$ |$$ /  $$ |\$$\$$  / $$$$$$$$ |$$ |  \__|\$$$$$$\  $$$$$$$$ |
$$ |\$  /$$ |$$  __$$ |$$ |  $$ | \$$$  /  $$   ____|$$ |       \____$$\ $$   ____|
$$ | \_/ $$ |\$$$$$$$ |\$$$$$$$ |  \$  /   \$$$$$$$\ $$ |      $$$$$$$  |\$$$$$$$\ 
\__|     \__| \_______| \____$$ |   \_/     \_______|\__|      \_______/  \_______|
                       $$\   $$ |                                                  
                       \$$$$$$  |                                                  
                        \______/                                                   

"""

system = platform.system()
base_dir = os.getcwd()
node_modules_dir = os.path.join(base_dir, 'node_modules')
logging = intro


def handle_interrupt(signum, frame):
    print("\n-- ❌ Interrupted! Exiting gracefully...")
    sys.exit(0)


def clear_screen():
    if system == "Windows":
        os.system("cls")
    else:
        os.system("clear")


def show_logs(log):
    global logging
    clear_screen()
    logging += "\n" + log
    print(logging)


def is_command_available(command):
    return shutil.which(command) is not None


def setup_node_environment():
    show_logs("-- Checking Node.js installation...")
    if not is_command_available("node") or not is_command_available("npm"):
        raise EnvironmentError("Node.js and/or npm not found. Please install Node.js first.")

    if not os.path.exists(node_modules_dir):
        show_logs("-- Installing Node.js packages...")
        subprocess.check_call(["npm", "install"])
    else:
        show_logs("-- Node modules already installed.")


def run_app():
    show_logs("-- ✅ Running app with npm start...\n")
    try:
        subprocess.run(["npm", "start"], shell=True)
    except Exception as e:
        raise Exception(f"Failed to start app: {e}")


if __name__ == "__main__":
    signal.signal(signal.SIGINT, handle_interrupt)

    show_logs("-- Running Magverse Frontend...")

    try:
        setup_node_environment()
        run_app()
    except Exception as e:
        show_logs(f"-- ERROR FAILED! {e}")

    input()
