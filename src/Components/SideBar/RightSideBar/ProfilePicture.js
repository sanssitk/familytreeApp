import React from "react";

const ProfilePicture = ({ sideDetails, renderInfos }) => {
  if (sideDetails) {
    return (
      <nav>
        <div className="userBasicInfo">
          <div
            className="userPicture"
            style={{
              backgroundImage: `url(${sideDetails?.data.image})`,
            }}
          ></div>
          <div className="userTitles">
            <h4>
              {`${sideDetails?.data.firstName} ${sideDetails?.data.lastName}`}
            </h4>
            <h4>Tel: {sideDetails?.data.phoneNumber}</h4>
            <h4>Email: {sideDetails?.data.email}</h4>
          </div>
        </div>
        {renderInfos(sideDetails)}
      </nav>
    );
  }
};

export default ProfilePicture;
