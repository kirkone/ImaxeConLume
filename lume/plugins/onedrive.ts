import Site from "lume/core/site.ts";
import { onedriveClient } from "../remote/onedrive.ts";
import { merge } from "lume/core/utils/object.ts";

export interface Options {
    share?: string;
    folder?: string;
}

export const defaults: Options = {
    folder: "images/"
};

interface OneDriveImage {
    "@content.downloadUrl": string;
    name: string;
    description: string;
    photo: {
        takenDateTime: string|number|Date;
    };
    image: unknown;
    date: Date;
}
  
export interface Image {
    src: string;
    name: string;
    file: string;
    description: string;
    date: Date;
}
  
export default async function (userOptions?: Options) {
    const options = merge(defaults, userOptions);
    
    const response = await fetch(onedriveClient.getApiUrl(options.share))
    
    const json = await response.json()

    const images: Array<Image> = json.value.map(
        (
            image: OneDriveImage
        ) => ({
        src: image['@content.downloadUrl'],
        name: image.name.replace(/\.[^/.]+$/, ""),
        file: image.name,
        description: image.description,
        photo: image.photo,
        size: image.image,
        date: new Date(image.photo.takenDateTime)
    })).sort((a: Image, b: Image) => a.date.getFullYear() - b.date.getFullYear()).reverse();
    
    const years = [...new Set(images.map((item) => item.date.getFullYear()))].sort().reverse();

    // console.log('---Images---\n', images)
    console.log('---Years---\n', years)
  
    return (site: Site) => {
        site.data("images", images);
        site.data("years", years);

        console.log('--- Processing remote images ---')
        images.forEach(image => {
            site.remoteFile(options.folder + image.name + "/" + image.file, image.src);
            console.log(image.file)
        });
        console.log('--- Done ---')
    };
}