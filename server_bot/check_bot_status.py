import psutil
import os
from datetime import datetime

def check_bot_status():
    """Mengecek status bot yang sedang berjalan."""
    print("=== STATUS BOT ===")
    
    # Cek proses Python yang menjalankan bot
    bot_processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'create_time']):
        try:
            if proc.info['name'] == 'python.exe':
                cmdline = proc.info['cmdline']
                if cmdline and any('bot_cloud.py' in arg for arg in cmdline):
                    bot_processes.append({
                        'pid': proc.info['pid'],
                        'create_time': datetime.fromtimestamp(proc.info['create_time']),
                        'cmdline': ' '.join(cmdline)
                    })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    if bot_processes:
        print("✓ Bot sedang berjalan:")
        for proc in bot_processes:
            runtime = datetime.now() - proc['create_time']
            print(f"  - PID: {proc['pid']}")
            print(f"    Runtime: {runtime}")
            print(f"    Command: {proc['cmdline']}")
    else:
        print("✗ Bot tidak sedang berjalan")
    
    # Cek proses Chrome
    chrome_processes = []
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            if proc.info['name'] in ['chrome.exe', 'chromedriver.exe']:
                chrome_processes.append(proc.info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    print(f"\nChrome processes: {len(chrome_processes)}")
    
    # Cek file log
    if os.path.exists('bot_service.log'):
        log_size = os.path.getsize('bot_service.log')
        log_mtime = datetime.fromtimestamp(os.path.getmtime('bot_service.log'))
        print(f"\nLog file: bot_service.log")
        print(f"  Size: {log_size} bytes")
        print(f"  Last modified: {log_mtime}")
    else:
        print("\nLog file: Tidak ada")

if __name__ == "__main__":
    try:
        check_bot_status()
    except ImportError:
        print("Error: psutil tidak terinstall")
        print("Install dengan: pip install psutil")
    except Exception as e:
        print(f"Error: {e}") 