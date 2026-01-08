# React Video Editor

## Overview

This project is created for the purpose of learning about video editing using React. It uses the following tech stack:

- react vite
- react redux
- video.js
- react-moveable
- uuid
- lucide-react
- clsx
- tailwindcss
- @xzdarcy/react-timeline-editor


Users can easily create videos using this tool and preview the results in real time. The editor also allows exporting and importing the current video editing state in JSON format.
At present, the tool supports three types of layers. See the **Features** section for more details:

* Video
* Image
* Text


## Installation

Follow these steps to setup the project:

**Prerequisites:**

- Node.js (v22.15.0 or compatible)
- npm (v10 or compatible)

**Steps:**

1.  Clone the repository.
2.  Open the project directory in your terminal.
3.  Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open the URL shown in the terminal (usually `http://localhost:5173`) to view the application.

## Docker Support

You can also run the application using Docker.

**Prerequisites:**

- Docker
- Docker Compose

**Using Docker Compose (Recommended):**

1.  Build and start the container:
    ```bash
    docker-compose up -d --build
    ```
2.  Open [http://localhost:3000](http://localhost:3000) to view the application.

**Using Docker manually:**

1.  Build the image:
    ```bash
    docker build -t react-video-editor .
    ```
2.  Run the container:
    ```bash
    docker run -p 3000:80 react-video-editor
    ```
3.  Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

- **Add video layer**
  By clicking on "Add Video" button and providing video URL, start time, and end time. The video will be added to the timeline editor.
- **Add image layer**
  By clicking on "Add Image" button and providing image URL, start time, and end time. The image will be added to the timeline editor.
- **Add text layer**
  By clicking on "Add Text" button and providing Text content, color, opacity, start time, and end time. The text layer will be added to the timeline editor.
- **Import video**
  By clicking Import button, users can import preconfigured or exported setting JSON file to the video editor based on configuration.
- **Export video**
  By clicking Export button, a JSON file is provided to the user to download. It exports the current video editing configuration.
- **Properties**
  Properties allow modifying values of a layer. Just select a layer and modify the value of properties.

## Main Libraries used

- **video.js**
  - This library helps to play video on stage based on timeline setting.
- **react-moveable**
  - This library helps to move, resize, rotate layers on stage.
- **@xzdarcy/react-timeline-editor**
  - This library helps to create the timeline editor.

## Import / Export Config

This is a sample config. The user can use this documentation to understand how the config works. A sample config example is also available in `sample-project.json`.

```json
{
  "stage": {
    "aspectRatio": "16:9"
  },
  "isLoading": false,
  "layers": [
    {
      "id": "sample-video-1",
      "type": "video",
      "name": "Big Buck Bunny",
      "zIndex": 1,
      "timeline": {
        "start": 5,
        "end": 33.5
      },
      "geometry": {
        "x": 0,
        "y": 0,
        "width": 1,
        "height": 1
      },
      "options": {
        "videoUrl": "/Big_Buck_Bunny_60fps_480P.mp4",
        "mute": false,
        "volume": 1,
        "speed": 1
      }
    },
    {
      "id": "sample-image-1",
      "type": "image",
      "name": "React Player Logo",
      "zIndex": 2,
      "timeline": {
        "start": 0.5,
        "end": 5
      },
      "geometry": {
        "x": 0.4089171092925483,
        "y": 0.11377337598425197,
        "width": 0.2,
        "height": 0.2
      },
      "options": {
        "imageUrl": "react-icon.svg"
      }
    },
    {
      "id": "sample-text-1",
      "type": "text",
      "name": "Title",
      "zIndex": 3,
      "timeline": {
        "start": 1,
        "end": 5
      },
      "geometry": {
        "x": 0.38412034827262703,
        "y": 0.3539325842696629,
        "width": 0.299650246062182,
        "height": 0.12172284644194757
      },
      "options": {
        "text": "React Video Player",
        "styles": {
          "color": "#000000",
          "opacity": 1,
          "fontSize": 30,
          "rotation": 0,
          "border": {
            "color": "#000000",
            "width": 1,
            "style": "solid"
          },
          "background": {
            "color": "#FFFFFF",
            "opacity": 0
          },
          "shadow": {
            "color": "#000000",
            "opacity": 0.5,
            "blur": 4,
            "spread": 0,
            "x": 2,
            "y": 2
          }
        }
      }
    },
    {
      "id": "062eba68-05b3-424c-bd10-a97f9f2f3928",
      "type": "text",
      "name": "Description ",
      "zIndex": 4,
      "timeline": {
        "start": 2,
        "end": 5
      },
      "geometry": {
        "x": 0.25905656961337786,
        "y": 0.5419446395131086,
        "width": 0.53,
        "height": 0.15
      },
      "options": {
        "text": "Video will be playing in few seconds",
        "styles": {
          "color": "#ffffff",
          "opacity": 1,
          "fontSize": 30,
          "rotation": 0,
          "border": {
            "color": "#000000",
            "width": 0,
            "style": "solid"
          },
          "background": {
            "color": "#000000",
            "opacity": 0
          },
          "shadow": {
            "color": "#000000",
            "opacity": 0,
            "blur": 0,
            "spread": 0,
            "x": 0,
            "y": 0
          }
        }
      }
    },
    {
      "id": "1797e727-203c-4420-9865-894084180d75",
      "type": "image",
      "name": "Video logo",
      "zIndex": 5,
      "timeline": {
        "start": 10,
        "end": 20
      },
      "geometry": {
        "x": 0.8662433606117753,
        "y": 0.019269808070866142,
        "width": 0.10740670253810619,
        "height": 0.15354330708661418
      },
      "options": {
        "imageUrl": "/vite.svg"
      }
    }
  ],
  "selectedLayerId": null,
  "currentTime": 0,
  "isPlaying": true,
  "duration": 40
}
```

## 🚀 Demo URL  

[👉 Open Video Editor Demo](https://videoeditor-alpha.labstack.site/)

## 🎥 Demo Video

https://videoeditor-alpha.labstack.site/demo-video.mp4




## Known Issues

- Performance for high resolution video is not good. It can be improved by using web worker.
