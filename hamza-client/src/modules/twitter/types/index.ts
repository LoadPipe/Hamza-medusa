export interface Tweet {
    id: string;
    text: string;
    author: {
        name: string;
        username: string;
        profile_image_url: string;
    };
}
