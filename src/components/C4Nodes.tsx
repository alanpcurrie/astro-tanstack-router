import { Handle, Position } from '@xyflow/react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';

// Styles for C4 nodes
const useStyles = makeStyles({
  c4NodeBase: {
    padding: '12px',
    borderRadius: tokens.borderRadiusMedium,
    width: '160px',
    fontSize: '12px',
    color: tokens.colorNeutralForegroundInverted,
    textAlign: 'center',
    border: `1px solid ${tokens.colorBrandBackground}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  // Person node styles
  personNode: {
    border: `1px solid ${tokens.colorBrandBackground}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  personIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Container node styles
  containerNode: {
    border: `2px dashed ${tokens.colorBrandBackground}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    padding: tokens.spacingVerticalM,
    width: '300px',
    height: '300px',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalM,
  },
  containerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorBrandBackground,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Component node styles
  componentNode: {
    border: `1px solid ${tokens.colorBrandForeground1}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  componentIcon: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorBrandForeground1,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // System node styles
  systemNode: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackgroundInverted,
  },
  systemIcon: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralStroke1,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Common styles
  nodeLabel: {
    fontWeight: '600',
    fontSize: '13px',
    marginBottom: tokens.spacingVerticalM,
    color: tokens.colorNeutralForegroundInverted,
  },
  nodeDescription: {
    fontSize: '11px',
    color: tokens.colorNeutralForegroundInverted,
    maxWidth: '140px',
    textAlign: 'center',
  },
  handle: {
    width: '6px',
    height: '6px',
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    border: `1px solid ${tokens.colorNeutralStrokeAccessible}`,
  },
  dottedLine: {
    borderBottom: `1px dashed ${tokens.colorNeutralStrokeAccessible}`,
    width: '100%',
    margin: '4px 0',
  },
  technology: {
    fontSize: '10px',
    color: tokens.colorNeutralForeground2,
    fontStyle: 'italic',
  }
});

// Person node component
export const PersonNode = ({ data }: { data: { label: string; description?: string; role?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.c4NodeBase} ${styles.personNode}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle}
      />
      
      <div className={styles.personIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="personIconTitle">
          <title id="personIconTitle">Person Icon</title>
          <circle cx="12" cy="7" r="5" fill="white"/>
          <path d="M3 19c0-4.4 3.6-8 8-8h2c4.4 0 8 3.6 8 8" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {(data.role || data.description) && <div className={styles.dottedLine} />}
      
      {data.role && (
        <Text className={styles.nodeDescription}>[{data.role}]</Text>
      )}
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle}
      />
    </div>
  );
};

// Container node component - designed as a group node
export const ContainerNode = ({ data }: { data: { label: string; description?: string; technology?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.containerNode}>
      <div className={styles.containerHeader}>
        <div className={styles.containerIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="containerIconTitle">
            <title id="containerIconTitle">Container Icon</title>
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="7" y="9" width="10" height="6" rx="1" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        <Text className={styles.nodeLabel}>{data.label}</Text>
        
        {(data.technology || data.description) && <div className={styles.dottedLine} />}
        
        {data.technology && (
          <Text className={styles.technology}>[{data.technology}]</Text>
        )}
        
        {data.description && (
          <Text className={styles.nodeDescription}>{data.description}</Text>
        )}
      </div>
      
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle}
      />
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle}
      />
    </div>
  );
};

// Component node component
export const ComponentNode = ({ data }: { data: { label: string; description?: string; technology?: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.c4NodeBase} ${styles.componentNode}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle}
      />
      
      <div className={styles.componentIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="componentIconTitle">
          <title id="componentIconTitle">Component Icon</title>
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {(data.technology || data.description) && <div className={styles.dottedLine} />}
      
      {data.technology && (
        <Text className={styles.technology}>[{data.technology}]</Text>
      )}
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle}
      />
    </div>
  );
};

// System node component
export const SystemNode = ({ data }: { data: { label: string; description?: string; external?: boolean } }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.c4NodeBase} ${styles.systemNode}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle}
      />
      
      <div className={styles.systemIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="systemIconTitle">
          <title id="systemIconTitle">System Icon</title>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      
      <Text className={styles.nodeLabel}>{data.label}</Text>
      
      {(data.external || data.description) && <div className={styles.dottedLine} />}
      
      {data.external && (
        <Text className={styles.technology}>[External System]</Text>
      )}
      
      {data.description && (
        <Text className={styles.nodeDescription}>{data.description}</Text>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle}
      />
    </div>
  );
};

// Export all C4 node types
export const c4NodeTypes = {
  person: PersonNode,
  container: ContainerNode,
  component: ComponentNode,
  system: SystemNode,
};
