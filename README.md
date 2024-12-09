<div style="text-align:center">
  <img src="https://github.com/user-attachments/assets/f92370ae-196c-437a-8437-972641222206" width="400" alt="logo"/>
</div>

# Build & Run the Project

## Prerequisites

The only prerequisite needed to run the project are `Docker` and `ngrok`. Please ensure Docker and ngrok are installed on your system.

### Docker Installation on Linux

You can install Docker using the following command:

```bash
sudo apt update
sudo apt install docker docker-compose
```

### Docker Installation on Windows

1. **Download Docker Desktop**:  
   Go to the [official Docker website](https://www.docker.com/products/docker-desktop) and download Docker Desktop for Windows.

2. **Install Docker Desktop**:  
   Follow the installation instructions and ensure Docker Desktop is configured to use WSL 2 (if applicable). You may need to enable virtualization in your system's BIOS if it isn't already enabled.

3. **Start Docker Desktop**:  
   After installation, launch Docker Desktop. Ensure it is running by checking its status in the taskbar.

4. **Verify Installation**:  
   Open a command prompt or PowerShell and run:

   ```powershell
   docker --version
   docker-compose --version
   ```

   This will confirm that Docker and Docker Compose are correctly installed.

### Using Curl (Alternative)

If you prefer using `curl`, you can install Docker with this command (Linux):

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Ngrok Installation

To install **ngrok** on your system, follow the official documentation corresponding to your operating system:

- **Linux**: Refer to the [official Linux installation guide](https://download.ngrok.com/linux) for step-by-step instructions.
- **Windows**: Follow the [official Windows installation guide](https://download.ngrok.com/windows?tab=download) to download and set up ngrok.

For additional installation methods or troubleshooting, visit the [ngrok installation documentation](https://download.ngrok.com/).

## Run the Project

Once the prerequisites are installed, you can build and run the project using the following commands.

### Linux / macOS

```bash
# Build and run the project
sudo docker-compose up --build

# Build and run the project in the background
sudo docker-compose up --build -d
```

### Windows (Command Prompt or PowerShell)

For Windows, `sudo` is not required. Use the following commands:

```powershell
# Build and run the project
docker-compose up --build

# Build and run the project in the background
docker-compose up --build -d
```

## Stop and Remove the Project

To stop and remove the project, use the following command:

### Linux / macOS

```bash
sudo docker-compose down -v
```

### Windows (Command Prompt or PowerShell)

```powershell
docker-compose down -v
```

## Documentation
### API Documentation

For more details about the API, feel free to check out the [AR3M API documentation](./docs/README_API.md). If you cloned the repository, you can view this documentation locally by running the following command:

```bash
cat ./docs/README_API.md
```

### Global Documentation

The complete documentation for the project is available on the [project wiki](https://github.com/mlargeot/Area/wiki).

## Cheat Warning

This repository is public for several reasons. As it is part of a third-year school project at EPITECH, please refrain from using it for your own EPITECH projects to avoid being flagged for cheating (-42). We are not responsible for any misuse of our repository.

## Authors

<table>
    <tbody>
        <tr>
            <td align="center">
                <a href="https://github.com/mlargeot">
                    <img src="https://avatars.githubusercontent.com/u/114756247?v=4" width="100px;" alt="mlargeot"/><br />
                    <sub><b>mlargeot</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/MaxenceLgt">
                    <img src="https://avatars.githubusercontent.com/u/114743051?v=4" width="100px;" alt="MaxenceLgt"/><br />
                    <sub><b>MaxenceLgt</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/DiaboloAB">
                    <img src="https://avatars.githubusercontent.com/u/109909203?v=4" width="100px;" alt="DiaboloAB"/><br />
                    <sub><b>DiaboloAB</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Raphael-Mabille">
                    <img src="https://avatars.githubusercontent.com/u/114739950?v=4" width="100px;" alt="Raphael-Mabille"/><br />
                    <sub><b>Raphael-Mabille</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/MrMarmotte">
                    <img src="https://avatars.githubusercontent.com/u/114657171?v=4" width="100px;" alt="MrMarmotte"/><br />
                    <sub><b>MrMarmotte</b></sub>
                </a>
            </td>
        </tr>
    </tbody>
</table>
