export class onedriveClient{
    public static getApiUrl(share: string ){
        const ondriveUriEncoded = btoa(share);

        const shareId = "u!" + ondriveUriEncoded.replace(new RegExp("[=]*$"), '').replace('/', '_').replace('+', '-');

        const url = "https://api.onedrive.com/v1.0/shares/" + shareId + "/root/children?$top=2147483647&$filter=startswith(file/mimeType,'image')&$select=name,description,image,photo,@content.downloadUrl&$orderby=photo/takenDateTime asc"
        
        console.log('---OneDrive share url---\n', url)

        return url;
    }
}