import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import IconSofa from "../../assets/img/new/sofa.svg";
import IconBathroom from "../../assets/img/new/bathroom.svg";
import IconLocation from "../../assets/img/new/location.svg";
import "./property-card.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { getPropertyValues } from "../LandshareAPIConsumer";
import { useGlobalContext } from "../../contexts/GlobalContext";

export default function PropertyCard({ property, style, active }) {
  const { isDarkMode } = useGlobalContext();
  const router = useRouter();
  const [propertyValue, setPropertyValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  useMemo(async () => {
    setIsLoading(true);
    if (property.coreLogicID) {
      const tt = property.coreLogicID
      try {
        const value = await getPropertyValues(tt);
        setPropertyValue(value)
      } catch (e) {
        console.log(e)
      }
    }
    if (propertyValue !== 0 && isFinite(parseFloat(propertyValue)) && propertyValue !== null && typeof propertyValue !== 'undefined')
      setIsLoading(false);
  }, [property])

  useEffect(() => {
    if (propertyValue !== 0 && isFinite(parseFloat(propertyValue)) && propertyValue !== null && typeof propertyValue !== 'undefined')
      setIsLoading(false);
  }, [propertyValue])
  return (
    <div className="property-card-wrapper cursor-pointer">
      <div className={`property-card-container ${active ? 'active' : ''}`} style={style} onClick={() => router.push(`/tokenized-asset/${property?.id}`)}>
        <SkeletonTheme baseColor={`${isDarkMode ? "#31333b" : "#dbdde0"}`} highlightColor={`${isDarkMode ? "#52545e" : "#f6f7f9"}`}>
          <div className="property-card-container property-card-preview-div">
            <img className="property-card-preview" src={property?.pictures ? property?.pictures[0] : "sfsdf"} alt="property image" />
            <div className="property-card-title">
              <img src={IconLocation} alt="location" />
              <div>{property.address}</div>
            </div>
            <span className="property-card-badge"
              style={{
                background: property.type == "Rental Property" ? "#FF5454" : "#3B98EE"
              }}
            >
              {property.type}
            </span>
          </div>
          <div className={`property-card-description-section ${active ? 'bg-tw-third' : ''}`}>
            <div className="property-card-price-wrapper">
              <div className="property-card-price-detail">
                <span className="property-card-label text-tw-text-third">Property Value</span>
                {isLoading ? (<Skeleton className="rounded-lg" width={80} height={26} />) : (<span className="property-card-value text-tw-text-primary">${propertyValue.toLocaleString()}</span>)}
              </div>
              <div className="property-card-price-detail">
                <span className="property-card-label text-tw-text-third">Rental Yield</span>
                {isLoading ? (<Skeleton className="rounded-lg" width={80} height={26} />) : (<span className="property-card-value text-tw-text-primary">{((property.grossRent * (1 - property.management) * 12 - property.insurance - property.tax) / propertyValue * 100).toFixed(2)}%</span>)}
              </div>
              <div className="property-card-price-detail">
                <span className="property-card-label text-tw-text-third">Ann. Return</span>
                {isLoading ? (<Skeleton className="rounded-lg" width={80} height={26} />) : (<span className="property-card-value text-tw-text-primary">{((property.grossRent * (1 - property.management) * 12 - property.insurance - property.tax) / propertyValue * 100 + property.appreciation).toFixed(2)}%</span>)}
              </div>
            </div>
            <div className="property-card-details-wrapper">
              <span className="property-card-type bg-tw-primary">Single Family</span>
              <div className="property-card-inventories">
                {property?.bedrooms &&
                  <div className="property-card-furniture">
                    <img src={IconSofa} alt="sofa" />
                    <div className="text-tw-text-primary">{property?.bedrooms}</div>
                  </div>
                }
                {property?.bathrooms &&
                  <div className="property-card-furniture">
                    <img src={IconBathroom} alt="sofa" />
                    <div className="text-tw-text-primary">{property?.bathrooms}</div>
                  </div>
                }
              </div>
            </div>
            {/* <div className="property-card-button-group">
              <Button outlined style={{ width: "100%" }} smallBtn>
                View Details
              </Button>
              <Button style={{ width: "100%" }} color="#fff" smallBtn>
                Invest Now
              </Button>
            </div> */}
          </div>
        </SkeletonTheme>
      </div>
    </div>
  );
}
