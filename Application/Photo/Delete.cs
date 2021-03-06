using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Photo
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }
        public class Handler : IRequestHandler<Command>
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

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccess.GetCurrentUsername());

                var photo = user.Photos.FirstOrDefault(x => x.Id==request.Id);
                if (photo == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not Found" });

                if (photo.IsMain)
                    throw new RestException(HttpStatusCode.BadRequest,
                        new { Photo = "You connot delete your main photo" });

                var result = _photoAccessor.Delete(photo.Id);

                user.Photos.Remove(photo);

                var sucess = await _context.SaveChangesAsync() > 0;
                if (sucess)
                    return Unit.Value;
                throw new Exception("Problem Saving Change");
            }
        }
    }
}
