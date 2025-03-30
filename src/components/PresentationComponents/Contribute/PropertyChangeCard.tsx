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
interface PropertyChangeCardProps {
    change: PropertyChange;
  }
  
 export const PropertyChangeCard = ({ change }: PropertyChangeCardProps) => {
    const { property } = change;
    let display: ReactNode = undefined;
    if (change.kind === 'direct') {
      display = <b>{change.changed + ''}</b>;
    } else if (change.kind === 'linked') {
      const { changed } = change;
      display = (
        <b>
          {changed ? (
            <>
              <span>
                {changed.entityRef.schema}#{changed.entityRef.id}
              </span>
              {change.linkedChanges && (
                <PropertyChangesList changes={change.linkedChanges} />
              )}
            </>
          ) : (
            '<null>'
          )}
        </b>
      );
    }
    if (change.kind === 'owned') {
      display = (
        <div style={{ paddingLeft: '20px' }}>
          <PropertyChangesList changes={change.changes} />
        </div>
      );
    }
    if (change.kind === 'ownedList') {
      display = (
        <div style={{ paddingLeft: '20px' }}>
          {change.modified && <PropertyChangesList changes={change.modified} />}
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
            <span>
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