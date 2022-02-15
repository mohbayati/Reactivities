using Application.Interfaces;
using Application.Photo;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Photo
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public PhotoAccessor(IOptions<CloudinarySetting> config)
        {
            var acc = new Account
            {
                ApiKey = config.Value.ApiKey,
                ApiSecret = config.Value.ApiSecret,
                Cloud = config.Value.CloudName
            };
            _cloudinary = new Cloudinary(acc);
        }

        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            var uploudResult = new ImageUploadResult();
            if(file.Length>0)
            {
                using (var stream=file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream)
                    };
                    uploudResult=_cloudinary.Upload(uploadParams);
                }  
            }
            if (uploudResult.Error != null)
                throw new Exception(uploudResult.Error.Message);
            return new PhotoUploadResult
            {
                PublicId = uploudResult.PublicId,
                Url = uploudResult.SecureUrl.AbsoluteUri
            };
        }

        public string Delete(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result= _cloudinary.Destroy(deleteParams);
            return result.Result == "ok" ? result.Result : new;
        }
    }
}
