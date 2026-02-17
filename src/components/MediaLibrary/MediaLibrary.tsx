"use client";

import React, { useState, useEffect } from "react";
import TextHeading from "../ui/textheader/TextHeader";
import Avatar from "../../components/commonComponent/Avatar";
import Image from "next/image";
import axios from "axios";

const MediaLibrary = () => {
  const [folders, setFolders] = useState([
    
  ]);
  const [fileNames, setFileNames] = useState({});
  const [folderName, setFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [clibs, setClibs] = useState<string[]>([]);
  interface UploadResponse {
  success: boolean;
  files: {
    name: string;
    publicPath: string;
    absolutePath: string;
  }[];
}
  
  useEffect(() => {
    fetchImages();
  }, []);
 let apiUrl = "/api/file";
  const uploadFile = async (file: File) => {
    let type = "1";
    apiUrl = "/api/file";
    try {
    if (!file) throw new Error("File is required");

    // Build query params
    const params = new URLSearchParams();
    params.append("type", type);

    // Form Data
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${apiUrl}?${params.toString()}`, {
      method: "POST",
      body: formData,
      credentials: "include", // if cookies/session required
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }
    else 
         alert("File uploaded successfully.");
    return data;
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
   
  };

  const createFolder = async (name: string) => {
    const jwt = localStorage.getItem("jwt");
    try {
      const response = await fetch(`${apiUrl}/api/folders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: { name },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Folder created:", data);

      setFolders((prev) => [
        ...prev,
        { name, folderCount: 0, assetCount: 0 },
      ]);

      alert("Folder created successfully.");
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder.");
    }
  };


  const fetchImages = async () => {
  let extractedUrls: string[] = [];
  let extractedclibs: string[] = [];
    try {
    // fetch images from Strapi backend
    const response = await fetch(`${apiUrl}`);

    // if response is not ok
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Error fetching images: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }
    const { files  } = (await response.json()) as UploadResponse;
    // return fetched images
    for (const item of files) {
      if(item.name.endsWith(".js") || item.name.endsWith(".css") ||  item.name.endsWith(".json"))
      extractedclibs.push(item.name);
        else
        extractedUrls.push(item.name);
  }
    setUrls(extractedUrls);
    setClibs(extractedclibs);
    return files;
  } catch (error: any) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
};

  return (
    <div className="card-body">
      <div className="title-header option-title">
        <TextHeading
          title="Digital Assets"
          icon="📁"
          // buttonprops={{
          //   buttonText: "+ Folder",
          //   title: "Add new folder",
          //   content: "Here you can create a new folder in the media library.",
          //   onClick: () => {
          //     const folderNameInput = prompt("Enter folder name:");
          //     if (folderNameInput) {
          //       createFolder(folderNameInput);
          //     }
          //   }
          // }}
          secondbuttonprops={{
            buttonText: "+ Assets",
            title: "Add new assets",
            content: "Here you can add new assets to the media library.",
            onClick: () => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '*/*';
              fileInput.onchange = (e: any) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  uploadFile(selectedFile);
                }
              };
              fileInput.click();
            }
          }}
        />

      </div>

      <div className="flex items-center gap-4 mx-2 my-4">
        <select className="border border-gray-300 rounded px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
          <option>Most recent uploads</option>
          <option>Oldest uploads</option>
        </select>
        <button className="bg-gray-100 px-3 py-2 rounded font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400">Filters</button>
      </div>

      <div className="grid grid-cols-1 mx-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-white rounded shadow"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 7v4a4 4 0 004 4h10a4 4 0 004-4V7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-600 text-start text-theme-md dark:text-gray-400">{folder.name}</p>
              <p className="text-sm text-gray-500">
                {folder.folderCount} folder, {folder.assetCount} assets
              </p>
            </div>
          </div>
        ))}
      </div>
      <div>
      <div className="w-full my-5">
        <p className="text-lg font-semibold">Image List</p>
        <span className="text-sm text-[#71717a]">
          This is where you find all uploaded images so as update anyone.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full pt-10">
      {urls.map((url, index) => (
          
          <li key={index}>
            <div className="img-box">
                <a href={`/api/file?file=${url}`} target="_blank" rel="noopener noreferrer">
                                    <Avatar data={`/api/file?file=${url}`} name={url} placeHolder={"/assets/images/placeholder.png"} customClass={undefined} height={undefined} width={undefined} noPrevClass={undefined} NameWithRound={undefined} imageClass={undefined}  /><span className="text-sm text-[#71717a]">{url}</span></a>
                                  </div>
                      </li>
        ))}
        </div>
    </div>
<div>
      
      <div>
      <div className="w-full my-5">
        <p className="text-lg font-semibold">Web Resources List</p>
        <span className="text-sm text-[#71717a]">
          This is where you find all uploaded Web Resources so as update anyone.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full pt-2">
      {clibs.map((url, index) => (
          
          <li key={index}>
            <div className=" pt-1 pl-1" ><a href={`http://localhost:3000/api/file?file=${url}`} target="_blank" rel="noopener noreferrer"><span className="text-sm text-[#71717a]">{url}</span> </a> </div> 
          </li>
        ))}
        </div>
    </div>
      
    
    </div>
    </div>
  );
};

export default MediaLibrary;