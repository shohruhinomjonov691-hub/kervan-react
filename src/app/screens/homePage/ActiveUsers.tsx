import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";

/* REDUX */
const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);

  return (
    <div className="active-users-frame">
      <Container maxWidth="lg">
        <Stack className="main">
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box className="section-label">Our Community</Box>
            <Box className="category-title">Top Members</Box>
          </Box>

          {/* Cards */}
          <Stack className="cards-frame">
            {topUsers.length !== 0 ? (
              topUsers.map((member: Member) => {
                const imagePath = member.memberImage
                  ? `${serverApi}/${member.memberImage}`
                  : "/icons/default-user.svg";

                return (
                  <Box key={member._id} className="user-card">
                    {/* Avatar */}
                    <Box className="user-card-avatar-wrap">
                      <img
                        src={imagePath}
                        alt={member.memberNick}
                        className="user-card-avatar"
                        onError={(e: any) => {
                          e.target.src = "/icons/default-user.svg";
                        }}
                      />
                    </Box>

                    {/* Info */}
                    <Box className="user-card-info">
                      <Typography className="user-card-name">
                        {member.memberNick}
                      </Typography>
                      <Box className="user-card-points">
                        <StarOutlinedIcon
                          sx={{ fontSize: 14, color: "#8d4b00" }}
                        />
                        <span>{member.memberPoints} pts</span>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box className="no-data">No top members yet!</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
