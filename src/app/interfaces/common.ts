export interface Application {
    id: string,
    company: string,
    position: string,
    status: string,
    date: Date,
    link: string,
    username: string,
    password: string,
    contacts: Contact[],
    todo: Todo[]
}

export interface Contact {
    id: string,
    name: string,
    email: string,
    cell: string
}

export interface Todo {
    id: string,
    description: string,
    isChecked: boolean
}

export interface Resume {
    id: string,
    filename: string,
    uploadDate: Date,
    dataUrl: string
}