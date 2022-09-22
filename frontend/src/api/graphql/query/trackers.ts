import { gql } from '@apollo/client';

export const TRACKERS_QUERY = gql`
  query Trackers($filters: TrackerFiltersInput!) {
    trackers(filters: $filters, pagination: { limit: -1 }, sort: "date") {
      data {
        id
        attributes {
          date
          duration
          description
          live
          status
          startLiveDate
          liveDurationMinutes
          live_status
          user {
            data {
              id
              attributes {
                username
                firstName
                lastName
                salaryInfo
                position
              }
            }
          }
          project {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;
