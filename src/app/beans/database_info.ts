export class DatabaseInfo {
    connectionName: string | null | undefined;
    hostName: string | null | undefined;
    port: number | null | undefined;
    userName: string | null | undefined;
    password: string | null | undefined;
    defaultChema: string | null | undefined;

    constructor(
        connectionName?: string | null | undefined,
        hostName?: string | null | undefined,
        port?: number | null | undefined,
        userName?: string | null | undefined,
        password?: string | null | undefined,
        defaultChema?: string | null | undefined) {

        this.connectionName = connectionName;
        this.hostName = hostName;
        this.port = port;
        this.userName = userName;
        this.password = password;
        this.defaultChema = defaultChema;
    }
};