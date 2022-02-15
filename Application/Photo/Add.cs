using MediatR;
using System;
using Persistence;
using Application.Interfaces;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Application.Photo
{
    public class Add
    {

        public class Command : IRequest<Domain.Photo>
        {
            public IFormFile File { get; set; }
        }
        public class Handler : IRequestHandler<Command, Domain.Photo>
        {
            private readonly DataContext _context;
            private readonly IUserAccess _userAccess;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context, IUserAccess userAccess, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _userAccess = userAccess;
                _photoAccessor = photoAccessor;
            }

            public async Task<Domain.Photo> Handle(Command request, CancellationToken cancellationToken)
            {
                var photoUploadResult = _photoAccessor.AddPhoto(request.File);
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccess.GetCurrentUsername());

                var photo = new Domain.Photo
                {
                    Id = photoUploadResult.PublicId,
                    Url = photoUploadResult.Url
                };

                if(!user.Photos.Any())
                    photo.IsMain = true;

                user.Photos.Add(photo);

                var sucess = await _context.SaveChangesAsync() > 0;
                if (sucess)
                    return photo;
                throw new Exception("Problem Saving Change");
            }
        }

    }
}
