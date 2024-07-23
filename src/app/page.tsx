"use client";
import Image from "next/image";
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Button } from 'antd';

import styles from "./page.module.css";
import { UploadChangeParam } from "antd/es/upload";
import UploadDragger from "./components/upload_dragger";
import { DatabaseInfo } from "./beans/database_info";


const { Dragger } = Upload;

function getFormattedDate(date: Date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

function readTextFile(fileToLoad: any, callback: Function) {

  var fileReader = new FileReader();
  fileReader.onload = (e: ProgressEvent<FileReader>) => {
    const textFromFileLoaded: string = e?.target?.result as string;
    callback(textFromFileLoaded, fileToLoad.name)
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}

function readMySQLConfig(xmlContent: string) {
  let databases: DatabaseInfo[] = []
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  const contentStructName = xmlDoc.getElementsByTagName("data")
  const connectionsList = xmlDoc.querySelectorAll('[struct-name="db.mgmt.Connection"]')
  for (let _index = 0; _index < connectionsList.length; _index++) {
    const connection = connectionsList[_index];
    const parameterValues = connection?.querySelector('[key="parameterValues"]');

    const connectionName = connection?.querySelector('[key="name"]')?.textContent;
    const hostName = parameterValues?.querySelector('[key="hostName"]')?.textContent;
    const port = parameterValues?.querySelector('[key="port"]')?.textContent;
    const userName = parameterValues?.querySelector('[key="userName"]')?.textContent;
    const password = parameterValues?.querySelector('[key="password"]')?.textContent;
    const schema = parameterValues?.querySelector('[key="schema"]')?.textContent;
    const dbInfo = new DatabaseInfo(connectionName, hostName, Number.parseInt(port ? port : '1'), userName, password, schema);
    databases.push(dbInfo);
  }
  createHeidiSQLSettingsFile(databases);
}

function createHeidiSQLSettingsFile(databases: DatabaseInfo[]) {
  let fileContents: string[] = []
  for (let _index = 0; _index < databases.length; _index++) {
    const _now = new Date();
    const _nowF = getFormattedDate(_now);
    const database: DatabaseInfo = databases[_index];
    fileContents.push(`Servers\\${database.connectionName}\\SessionCreated<|||>1<|||>${_nowF}`)
    fileContents.push(`Servers\\${database.connectionName}\\Host<|||>1<|||>${database.hostName}`)
    fileContents.push(`Servers\\${database.connectionName}\\WindowsAuth<|||>3<|||>0`)
    fileContents.push(`Servers\\${database.connectionName}\\CleartextPluginEnabled<|||>3<|||>0`)
    fileContents.push(`Servers\\${database.connectionName}\\User<|||>1<|||>${database.userName}`)
    fileContents.push(`Servers\\${database.connectionName}\\Password<|||>1<|||>8`)
    fileContents.push(`Servers\\${database.connectionName}\\LoginPrompt<|||>3<|||>0`)
    fileContents.push(`Servers\\${database.connectionName}\\Port<|||>1<|||>${database.port}`)
    fileContents.push(`Servers\\${database.connectionName}\\NetType<|||>3<|||>0`)
    fileContents.push(`Servers\\${database.connectionName}\\Compressed<|||>3<|||>0`)
    fileContents.push(`Servers\\${database.connectionName}\\LocalTimeZone<|||>3<|||>0`)
    fileContents.push(`Servers\\${database.connectionName}\\QueryTimeout<|||>3<|||>30`)
    fileContents.push(`Servers\\${database.connectionName}\\KeepAlive<|||>3<|||>20`)
    fileContents.push(`Servers\\${database.connectionName}\\FullTableStatus<|||>3<|||>1`)
    fileContents.push(`Servers\\${database.connectionName}\\Databases<|||>1<|||>`)
    fileContents.push(`Servers\\${database.connectionName}\\Library<|||>1<|||>libmysql.dll`)
    fileContents.push(`Servers\\${database.connectionName}\\Comment<|||>1<|||>`)
  }
  debugger
  let a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([fileContents.join('\r\n')], { type: 'text/txt' }));
  a.download = 'test.csv';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


const props: UploadProps = {
  name: 'file',
  multiple: false,
  // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  beforeUpload(file) {
    readTextFile(file, readMySQLConfig);
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>How to find CONNECTIONS.XML? <a href="https://dev.mysql.com/doc/workbench/en/wb-configuring-files.html">HERE</a></p>

      </div>

      <div className={styles.center}>
        <UploadDragger {...props} />
      </div>

      <div className={styles.grid}>

      </div>
    </main>
  );
}
