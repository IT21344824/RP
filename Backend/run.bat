@echo off
REM Activate the virtual environment
call venv\Scripts\activate

REM Run the Flask app
python run.py

REM Deactivate the virtual environment after running the app
deactivate
