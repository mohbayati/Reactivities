using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class ActivityEnvelop
        {
            public List<ActivityDto> activities { get; set; }
            public int ActivityCount { get; set; }
        }
        public class Query : IRequest<ActivityEnvelop>
        {
            //public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
            //{
            //    Limit = limit;
            //    Offset = offset;
            //    IsGoing = isGoing;
            //    IsHost = isHost;
            //    StartDate = startDate ?? DateTime.Now;
            //}
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsGoing { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }
        }
        public class Handler : IRequestHandler<Query, ActivityEnvelop>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccess _userAccess;

            public Handler(DataContext context, IMapper mapper, IUserAccess userAccess)
            {
                _context = context;
                _mapper = mapper;
                _userAccess = userAccess;
            }

            public async Task<ActivityEnvelop> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Activities
                        .Where(x => x.Date >= (request.StartDate?? DateTime.Now))
                        .OrderBy(x => x.Date)
                        .AsQueryable();

                if (request.IsGoing && !request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(a =>
                              a.AppUser.UserName == _userAccess.GetCurrentUsername()));
                }

                if (!request.IsGoing && request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(a =>
                              a.AppUser.UserName == _userAccess.GetCurrentUsername() && a.IsHost));
                }

                var activities = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3)
                    .ToListAsync();
                return new ActivityEnvelop
                {
                    activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }
    }
}