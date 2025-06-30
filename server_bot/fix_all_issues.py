#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import sys
import os
import platform

def run_command(command, description=""):
    """Run a command and return success status"""
    print(f"🔄 {description}")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=120)
        if result.returncode == 0:
            print(f"✅ {description} - SUCCESS")
            return True
        else:
            print(f"❌ {description} - FAILED")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {description} - ERROR: {e}")
        return False

def check_system():
    """Check system type and Python installation"""
    print("=== SYSTEM CHECK ===")
    print(f"OS: {platform.system()}")
    print(f"Architecture: {platform.machine()}")
    
    # Check Python
    python_version = sys.version_info
    print(f"Python: {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 7):
        print("❌ Python version too old. Need Python 3.7+")
        return False
    
    print("✅ Python version OK")
    return True

def install_pip():
    """Install pip if not available"""
    print("\n=== INSTALLING PIP ===")
    
    # Check if pip is available
    try:
        import pip
        print("✅ pip already available")
        return True
    except ImportError:
        print("❌ pip not available, installing...")
    
    system = platform.system().lower()
    
    if system == "linux":
        # For Ubuntu/Debian
        if os.path.exists("/etc/debian_version"):
            return run_command("sudo apt update && sudo apt install -y python3-pip", "Install pip (Ubuntu/Debian)")
        # For other Linux
        else:
            return run_command("sudo yum install -y python3-pip", "Install pip (RHEL/CentOS)")
    elif system == "darwin":
        return run_command("brew install python3", "Install Python3 with pip (macOS)")
    else:
        print("❌ Unsupported system for automatic pip installation")
        return False

def upgrade_pip():
    """Upgrade pip to latest version"""
    print("\n=== UPGRADING PIP ===")
    return run_command(f"{sys.executable} -m pip install --upgrade pip", "Upgrade pip")

def install_dependencies():
    """Install all required Python dependencies"""
    print("\n=== INSTALLING DEPENDENCIES ===")
    
    dependencies = [
        "selenium>=4.15.0",
        "webdriver-manager>=4.0.0", 
        "pymongo>=4.6.0",
        "certifi>=2023.11.0",
        "dnspython>=2.4.0",
        "requests>=2.31.0",
        "psutil>=5.9.0"
    ]
    
    success_count = 0
    for dep in dependencies:
        if run_command(f"{sys.executable} -m pip install {dep}", f"Install {dep}"):
            success_count += 1
    
    print(f"\n📊 Dependencies installed: {success_count}/{len(dependencies)}")
    return success_count == len(dependencies)

def install_chrome_linux():
    """Install Chrome on Linux"""
    print("\n=== INSTALLING CHROME (Linux) ===")
    
    # Check if Chrome is already installed
    if run_command("google-chrome --version", "Check Chrome version"):
        print("✅ Chrome already installed")
        return True
    
    # Install Chrome
    if os.path.exists("/etc/debian_version"):
        # Ubuntu/Debian
        commands = [
            "wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -",
            "echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list",
            "sudo apt update",
            "sudo apt install -y google-chrome-stable"
        ]
    else:
        # Other Linux
        commands = [
            "sudo yum install -y google-chrome-stable"
        ]
    
    for cmd in commands:
        if not run_command(cmd, f"Chrome setup: {cmd}"):
            return False
    
    return True

def install_chromedriver():
    """Install ChromeDriver"""
    print("\n=== INSTALLING CHROMEDRIVER ===")
    
    # Install webdriver-manager if not already installed
    run_command(f"{sys.executable} -m pip install webdriver-manager", "Install webdriver-manager")
    
    # Test ChromeDriver
    test_script = """
import os
import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

try:
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.quit()
    print("ChromeDriver test successful")
except Exception as e:
    print(f"ChromeDriver test failed: {e}")
    sys.exit(1)
"""
    
    with open("test_chromedriver.py", "w") as f:
        f.write(test_script)
    
    success = run_command(f"{sys.executable} test_chromedriver.py", "Test ChromeDriver")
    os.remove("test_chromedriver.py")
    
    return success

def test_mongodb_connection():
    """Test MongoDB connection"""
    print("\n=== TESTING MONGODB CONNECTION ===")
    
    test_script = """
import certifi
from pymongo import MongoClient

try:
    client = MongoClient(
        'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=10000
    )
    client.admin.command('ping')
    print("MongoDB connection successful")
    client.close()
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    exit(1)
"""
    
    with open("test_mongodb.py", "w") as f:
        f.write(test_script)
    
    success = run_command(f"{sys.executable} test_mongodb.py", "Test MongoDB connection")
    os.remove("test_mongodb.py")
    
    return success

def fix_file_permissions():
    """Fix file permissions for shell scripts"""
    print("\n=== FIXING FILE PERMISSIONS ===")
    
    # Make all .sh files executable
    for file in os.listdir("."):
        if file.endswith(".sh"):
            run_command(f"chmod +x {file}", f"Make {file} executable")
    
    return True

def main():
    """Main function to fix all issues"""
    print("🔧 AUTO FIX ALL ISSUES")
    print("=" * 50)
    
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # System check
    if not check_system():
        print("❌ System check failed")
        return False
    
    # Install pip
    if not install_pip():
        print("❌ Failed to install pip")
        return False
    
    # Upgrade pip
    upgrade_pip()
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install some dependencies")
        return False
    
    # Install Chrome (Linux only)
    if platform.system().lower() == "linux":
        install_chrome_linux()
    
    # Install ChromeDriver
    if not install_chromedriver():
        print("❌ Failed to install ChromeDriver")
        return False
    
    # Test MongoDB
    if not test_mongodb_connection():
        print("❌ MongoDB connection failed")
        print("Please check your internet connection and MongoDB Atlas settings")
        return False
    
    # Fix permissions
    fix_file_permissions()
    
    print("\n" + "=" * 50)
    print("🎉 AUTO FIX COMPLETED!")
    print("=" * 50)
    print("✅ All issues have been fixed automatically")
    print("✅ Your bot should now be ready to run")
    print("\nYou can now:")
    print("- Run: ./menu_utama.sh")
    print("- Run: ./run_bot.sh")
    print("- Run: ./check_readiness.sh")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 