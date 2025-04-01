import {
    addToChangeSet,
    combineChanges,
    dropOrphans,
    EntityChange,
    PropertyChange,
  } from '@/models/changeSets';

  import React, {
    ReactNode,
    useCallback,
    useMemo,
    useState,
    useEffect,
  } from 'react';
import { PropertyChangesList } from './PropertyChangesList';
import '@/style/contributeContent.scss';
interface PropertyChangeCardProps {
    change: PropertyChange;
    handleFieldChange: (section: string, fieldName: string, previousValue: any) => void;
  }
  
 export const PropertyChangeCard = ({ change,handleFieldChange }: PropertyChangeCardProps) => {
    const { property } = change;
    let display: ReactNode = undefined;
    if (change.kind === 'direct') {
      display = <span className='details-changes'>{change.changed + ''}</span>;
    } else if (change.kind === 'linked') {
      const { changed } = change;
      display = (
        <>
          {changed ? (
            <>
              <span className='details-changes'>
                {changed.entityRef.schema}#{changed.entityRef.id}
              </span>
              {change.linkedChanges && (
                <PropertyChangesList changes={change.linkedChanges} handleFieldChange={handleFieldChange} />
              )}
            </>
          ) : (
            '<null>'
          )}
        </>
      );
    }
    if (change.kind === 'owned') {
      display = (
        <div style={{ paddingLeft: '20px' }} className='details-changes'>
          <PropertyChangesList changes={change.changes} handleFieldChange={handleFieldChange} />
        </div>
      );
    }
    if (change.kind === 'ownedList') {
      display = (
        <div style={{ paddingLeft: '20px' }} className='details-changes' >
          {change.modified && <PropertyChangesList changes={change.modified} handleFieldChange={handleFieldChange}/>}
          <ul>
            {change.removed.map((r, i) => (
              <li key={i}>Removed item with id {r.id}</li>
            ))}
          </ul>
        </div>
      );
    }
    // TODO: other kinds
    return (
      <>
        {change.kind !== 'ownedList' && (
          <>
            <span className='property-change'>
              {property}
              {' => '}
            </span>
          </>
        )}
       {display}
        &nbsp;
        <small>{change.comments}</small>
      </>
    );
  };