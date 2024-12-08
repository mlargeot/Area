<div style="text-align:center">
  <img src="https://github.com/user-attachments/assets/f92370ae-196c-437a-8437-972641222206" width="400" alt="logo"/>
</div>

# Build & Run the Project

## Prerequisites

The only prerequisite needed to run the project is `Docker`. Please ensure Docker is installed on your system.

### Installation on Linux

You can install Docker using the following command:

```bash
sudo apt update
sudo apt install docker docker-compose
```

### Installation on Windows

1. Download and install Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).
2. Follow the installation instructions and ensure Docker Desktop is running.

### Using Curl (Alternative)

If you prefer using `curl`, you can install Docker with this command:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## Run the Project

Once the prerequisites are installed, you can build and run the project using the following commands:

```bash
# Build and run the project
sudo docker compose up --build

# Build and run the project in the background
sudo docker compose up --build -d
```

## Stop and Remove the Project

If you want to stop and remove the project, run the following command:

```bash
sudo docker compose down -v
```

# Documentation

- [README API]()
- [AR3M wiki]()


# Cheat Warning

This repository is public for several reasons. As it is part of a third-year school project at EPITECH, please refrain from using it for your own EPITECH projects to avoid being flagged for cheating (-42). We are not responsible for any misuse of our repository.

# Authors

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
