using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommetDto>
        {
            public string Body { get; set; }
            public string UserName { get; set; }
            public Guid ActivityId { get; set; }
        }
        public class Handler : IRequestHandler<Command, CommetDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<CommetDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not found" });
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);

                var comment = new Comment
                {
                    Activity = activity,
                    Author = user,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                activity.Comments.Add(comment);
                var sucess = await _context.SaveChangesAsync() > 0;
                if (sucess)
                    return _mapper.Map<CommetDto>(comment);
                throw new Exception("Problem Saving Change");
            }
        }

    }
}