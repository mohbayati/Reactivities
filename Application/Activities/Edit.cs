using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //logic here
                var activitie = await _context.Activities.FindAsync(request.Id);
                if (activitie == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });
                }

                activitie.Category = request.Category ?? activitie.Category;
                activitie.City = request.City ?? activitie.City;
                activitie.Date = request.Date ?? activitie.Date;
                activitie.Description = request.Description ?? activitie.Description;
                activitie.Title = request.Title ?? activitie.Title;
                activitie.Venue = request.Venue ?? activitie.Venue;

                var sucess = await _context.SaveChangesAsync() > 0;
                if (sucess)
                    return Unit.Value;
                throw new Exception("Problem Saving Change");
            }
        }

    }
}